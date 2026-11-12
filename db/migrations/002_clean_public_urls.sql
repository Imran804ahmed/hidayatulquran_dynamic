-- The public website moved from /<page>.html to clean URLs (/<page>); old URLs 301-redirect.
-- Update the course links stored by 001 so the portal points at the canonical addresses.
-- Only rewrites values that still have the old form, so it is safe on edited rows.
UPDATE hq_courses
SET public_url = LEFT(public_url, CHAR_LENGTH(public_url) - 5)
WHERE public_url LIKE '/%.html';
