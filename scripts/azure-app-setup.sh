#!/usr/bin/env bash
# Registers the Azure app that lets the site read and reply to inquiries.
#
#   bash scripts/azure-app-setup.sh
#
# Does the three portal steps in one go: creates the app, allows public client
# flows, and adds the three delegated Graph permissions. Prints the client ID
# and the exact next command to run.
#
# WORKS FOR a Microsoft 365 / work or school mailbox.
# DOES NOT WORK for a personal outlook.com account — those have no Azure AD
# tenant for the CLI to talk to, so register the app by hand in the portal
# instead (see docs/inquiry-automation.md).

set -euo pipefail

APP_NAME="${APP_NAME:-Step Away inquiry bot}"
GRAPH_APP_ID="00000003-0000-0000-c000-000000000000"
SCOPES=("Mail.ReadWrite" "Mail.Send" "offline_access")

say() { printf '\n\033[1m%s\033[0m\n' "$1"; }
die() { printf '\n\033[31m%s\033[0m\n\n' "$1" >&2; exit 1; }

command -v az >/dev/null 2>&1 || die \
"The Azure CLI is not installed.

  macOS:    brew install azure-cli
  Windows:  winget install Microsoft.AzureCLI
  Other:    https://learn.microsoft.com/cli/azure/install-azure-cli

Then run this script again."

# --allow-no-subscriptions matters: this account may have no Azure subscription,
# only a Microsoft 365 tenant, and a plain `az login` refuses that.
if ! az account show >/dev/null 2>&1; then
  say "Signing you in — a browser window will open."
  az login --allow-no-subscriptions --only-show-errors >/dev/null \
    || die "Sign-in did not complete. Run the script again."
fi

TENANT="$(az account show --query tenantId -o tsv 2>/dev/null || true)"
say "Signed in to tenant ${TENANT:-unknown}."

# --- create the app -------------------------------------------------------
# An app with this name may already exist from an earlier run; reuse it rather
# than piling up duplicates that all look identical in the portal.
APP_ID="$(az ad app list --display-name "$APP_NAME" --query "[0].appId" -o tsv --only-show-errors 2>/dev/null || true)"

if [ -n "$APP_ID" ] && [ "$APP_ID" != "null" ]; then
  say "Reusing the existing \"$APP_NAME\" registration."
else
  say "Creating the app registration \"$APP_NAME\"..."
  APP_ID="$(az ad app create \
    --display-name "$APP_NAME" \
    --sign-in-audience AzureADandPersonalMicrosoftAccount \
    --is-fallback-public-client true \
    --query appId -o tsv --only-show-errors)" \
    || die "Could not create the app. Your account may not be allowed to register applications — an administrator can do it, or use the portal steps in docs/inquiry-automation.md."
fi

[ -n "$APP_ID" ] || die "No application ID came back. Use the portal steps instead."

# --is-fallback-public-client is "Allow public client flows" in the portal.
# Set it again explicitly so a reused app gets it too.
az ad app update --id "$APP_ID" --is-fallback-public-client true --only-show-errors >/dev/null

# --- add the delegated Graph permissions ---------------------------------
# Look the scope IDs up rather than hardcoding GUIDs, so this stays correct if
# Microsoft ever reshuffles them.
say "Adding mail permissions..."
for scope in "${SCOPES[@]}"; do
  id="$(az ad sp show --id "$GRAPH_APP_ID" \
        --query "oauth2PermissionScopes[?value=='$scope'].id | [0]" \
        -o tsv --only-show-errors 2>/dev/null || true)"

  [ -n "$id" ] && [ "$id" != "null" ] \
    || die "Could not look up the '$scope' permission. Add the three permissions by hand in the portal (API permissions -> Microsoft Graph -> Delegated)."

  az ad app permission add --id "$APP_ID" \
    --api "$GRAPH_APP_ID" --api-permissions "$id=Scope" \
    --only-show-errors >/dev/null 2>&1 || true
  printf '  added %s\n' "$scope"
done

# --- done -----------------------------------------------------------------
cat <<DONE

$(printf '\033[1m%s\033[0m' "Done. Your client ID is:")

  $APP_ID

$(printf '\033[1m%s\033[0m' "Next, sign in as the inquiry mailbox:")

  MS_CLIENT_ID=$APP_ID npm run outlook:auth

That prints a code to enter in a browser. Sign in as the mailbox that receives
the Beachcombers NW inquiries, and it will give you the MS_REFRESH_TOKEN.

DONE
