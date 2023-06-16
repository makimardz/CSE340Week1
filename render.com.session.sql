CREATE TYPE public.account_type AS ENUM
    ('Client', 'Emnployee', 'Admin');

ALTER TYPE public.account_type
    OWNER TO cse340ma;