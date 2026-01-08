#!/bin/bash
#
# Download NHS Digital data files for GP Practice Comparison tool
#
# Usage:
#   ./download-nhs-data.sh [workforce_url] [patients_url]
#
# If URLs are not provided, the script will attempt to find the latest files
# from NHS Digital's website.
#

set -e

RAW_DATA_DIR="raw-data"
mkdir -p "$RAW_DATA_DIR"

WORKFORCE_URL="${1:-}"
PATIENTS_URL="${2:-}"

echo "================================================"
echo "NHS Digital Data Download Script"
echo "================================================"
echo ""

# Function to download a file
download_file() {
    local url="$1"
    local output="$2"
    echo "Downloading: $url"
    echo "To: $output"
    curl -L -f -o "$output" "$url"
    echo "✓ Downloaded successfully"
    echo ""
}

# Function to extract zip file
extract_zip() {
    local zipfile="$1"
    local destdir="$2"
    echo "Extracting: $zipfile"
    unzip -o "$zipfile" -d "$destdir"
    rm "$zipfile"
    echo "✓ Extracted successfully"
    echo ""
}

# Function to find latest workforce data URL from NHS Digital
find_workforce_url() {
    echo "Searching for latest GP Workforce data..."

    # NHS Digital GP Workforce page
    local page_url="https://digital.nhs.uk/data-and-information/publications/statistical/general-and-personal-medical-services"

    # Try to find the latest publication page
    local latest_page=$(curl -s "$page_url" | grep -oE 'href="[^"]+general-and-personal-medical-services/[0-9]+-[a-z]+-[0-9]+"' | head -1 | sed 's/href="//' | sed 's/"$//')

    if [ -z "$latest_page" ]; then
        echo "Could not find latest publication page"
        return 1
    fi

    local full_url="https://digital.nhs.uk${latest_page}"
    echo "Found latest publication: $full_url"

    # Try to find the Practice Level Detailed CSV download link
    local download_link=$(curl -s "$full_url" | grep -oE 'href="[^"]+Practice[^"]+Detailed[^"]*\.zip"' | head -1 | sed 's/href="//' | sed 's/"$//')

    if [ -z "$download_link" ]; then
        # Try alternative pattern
        download_link=$(curl -s "$full_url" | grep -oE 'href="[^"]+practice-level[^"]*detailed[^"]*\.zip"' -i | head -1 | sed 's/href="//' | sed 's/"$//')
    fi

    if [ -z "$download_link" ]; then
        echo "Could not find download link on page"
        return 1
    fi

    # Handle relative URLs
    if [[ "$download_link" == /* ]]; then
        download_link="https://digital.nhs.uk${download_link}"
    fi

    echo "Found download URL: $download_link"
    echo "$download_link"
}

# Function to find latest patient registration data URL
find_patients_url() {
    echo "Searching for latest Patient Registration data..."

    # NHS Digital Patients Registered page
    local page_url="https://digital.nhs.uk/data-and-information/publications/statistical/patients-registered-at-a-gp-practice"

    # Try to find the latest publication page
    local latest_page=$(curl -s "$page_url" | grep -oE 'href="[^"]+patients-registered-at-a-gp-practice/[^"]+[0-9]{4}"' | head -1 | sed 's/href="//' | sed 's/"$//')

    if [ -z "$latest_page" ]; then
        echo "Could not find latest patient registration page"
        return 1
    fi

    local full_url="https://digital.nhs.uk${latest_page}"
    echo "Found latest publication: $full_url"

    # Try to find the practice-level CSV download link
    local download_link=$(curl -s "$full_url" | grep -oE 'href="[^"]+gp-reg-pat-prac-all[^"]*\.zip"' -i | head -1 | sed 's/href="//' | sed 's/"$//')

    if [ -z "$download_link" ]; then
        # Try alternative pattern
        download_link=$(curl -s "$full_url" | grep -oE 'href="[^"]+patients[^"]*practice[^"]*\.zip"' -i | head -1 | sed 's/href="//' | sed 's/"$//')
    fi

    if [ -z "$download_link" ]; then
        echo "Could not find download link on page"
        return 1
    fi

    # Handle relative URLs
    if [[ "$download_link" == /* ]]; then
        download_link="https://digital.nhs.uk${download_link}"
    fi

    echo "Found download URL: $download_link"
    echo "$download_link"
}

# ============================================
# WORKFORCE DATA
# ============================================
echo "Step 1: GP Workforce Data"
echo "-------------------------"

if [ -n "$WORKFORCE_URL" ]; then
    echo "Using provided URL: $WORKFORCE_URL"
else
    echo "No URL provided, attempting to auto-detect..."
    WORKFORCE_URL=$(find_workforce_url) || {
        echo "❌ Could not auto-detect workforce URL"
        echo "Please provide the URL manually or check NHS Digital website"
        exit 1
    }
fi

# Download and extract workforce data
download_file "$WORKFORCE_URL" "$RAW_DATA_DIR/workforce.zip"
extract_zip "$RAW_DATA_DIR/workforce.zip" "$RAW_DATA_DIR"

# ============================================
# PATIENT REGISTRATION DATA
# ============================================
echo "Step 2: Patient Registration Data"
echo "----------------------------------"

if [ -n "$PATIENTS_URL" ]; then
    echo "Using provided URL: $PATIENTS_URL"
else
    echo "No URL provided, attempting to auto-detect..."
    PATIENTS_URL=$(find_patients_url) || {
        echo "⚠️ Could not auto-detect patients URL, continuing without it"
        echo "Patient registration data is optional but improves accuracy"
    }
fi

if [ -n "$PATIENTS_URL" ]; then
    download_file "$PATIENTS_URL" "$RAW_DATA_DIR/patients.zip"
    extract_zip "$RAW_DATA_DIR/patients.zip" "$RAW_DATA_DIR"
fi

# ============================================
# SUMMARY
# ============================================
echo ""
echo "================================================"
echo "Download Complete"
echo "================================================"
echo ""
echo "Files in $RAW_DATA_DIR:"
ls -la "$RAW_DATA_DIR"
echo ""
echo "Ready for processing with: npx tsx scripts/process-nhs-data.ts"
