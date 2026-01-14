# TODO: Fix DisasterMap.tsx for EWS Markers

## Current Issues
- Markers not appearing due to strict coordinate validation
- Filtering too rigid, not using includes
- Popup showing undefined values
- FID 38 & 40 (EWS Awan Panas) not showing

## Plan
- [ ] Update coordinate validation in fetch useEffect to use only !isNaN(Number(lat)) && !isNaN(Number(lon))
- [ ] Update marker creation validation to same rule
- [ ] Change marker color determination to use toLowerCase().includes() for tipe_ews
- [ ] Update popup to handle undefined fields with fallback
- [ ] Ensure all markers are added to correct layers based on includes
- [ ] Add debug console.log for data mapping
- [ ] Test that all data appears, especially FID 38 & 40

## Files to Edit
- src/components/DisasterMap.tsx

## Changes Made
- Updated validation in marker creation to use !isNaN(Number(lat)) && !isNaN(Number(lon))
- Changed marker color logic to use toLowerCase().includes() instead of ===
- Updated popup to show fallback values instead of undefined
- Renamed tipeLower to tipeLowerFilter to avoid redeclaration
- Added debug logs for valid coordinates
- All markers should now appear, including FID 38 & 40 (EWS Awan Panas)
