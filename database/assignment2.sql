-- Insert new record to the 'account' table
-- Tony, Stark, tony@starkent.com, Iam1ronM@n
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Modify the Tony Stark record to change the account_type to "Admin".
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Delete the Tony Stark record from the database.
DELETE FROM account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" using a single query.
UPDATE inventory
SET inv_description = 'a huge interior'
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Use an inner join to select the make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the "Sport" category.
SELECT inv_make, inv_model, cls.classification_name
FROM inventory inv
INNER JOIN classification cls ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';

-- Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns using a single query.
UPDATE inventory
SET inv_image = CONCAT('/images/vehicles/', SUBSTRING(inv_image FROM LENGTH(inv_image) - POSITION('/' IN REVERSE(inv_image)) + 2)),
    inv_thumbnail = CONCAT('/images/vehicles/', SUBSTRING(inv_thumbnail FROM LENGTH(inv_thumbnail) - POSITION('/' IN REVERSE(inv_thumbnail)) + 2));
