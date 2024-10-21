CREATE TABLE IF NOT EXISTS public.post
(
    post_id serial NOT NULL,
    content text,
    upvotes integer,
    downvotes integer,
    advisor_id integer NOT NULL,
    PRIMARY KEY (post_id)
);

CREATE TABLE IF NOT EXISTS public."users"
(
    users_id serial NOT NULL,
    name text NOT NULL,
    password text NOT NULL,
    role text NOT NULL,
    advisor_id integer,
    PRIMARY KEY (users_id)
);

CREATE TABLE IF NOT EXISTS public.stock
(
    symbol text NOT NULL,
    name text NOT NULL,
    market text NOT NULL,
    sector text NOT NULL,
    current_price double precision NOT NULL,
    "time" timestamp(6) without time zone NOT NULL,
    PRIMARY KEY (symbol)
);

CREATE TABLE IF NOT EXISTS public.propose
(
    propose_id serial NOT NULL,
    content text,
    accepted boolean NOT NULL,
    quantity integer NOT NULL,
    stock_id text NOT NULL,
    advisor_id integer NOT NULL,
    investor_id integer NOT NULL,
    PRIMARY KEY (propose_id)
);

CREATE TABLE IF NOT EXISTS public.transaction
(
    transaction_id serial NOT NULL,
    amount integer NOT NULL,
    type text NOT NULL,
    propose_id integer NOT NULL,
    PRIMARY KEY (transaction_id)
);

CREATE TABLE IF NOT EXISTS public.stock_users
(
    stock_symbol text NOT NULL,
    users_users_id serial NOT NULL
);

CREATE TABLE IF NOT EXISTS public.review
(
    id serial NOT NULL,
    investor_id integer NOT NULL,
    advisor_id integer NOT NULL,
    rating integer NOT NULL,
    feedback text,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.post
    ADD FOREIGN KEY (advisor_id)
    REFERENCES public."users" (users_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."users"
    ADD FOREIGN KEY (advisor_id)
    REFERENCES public."users" (users_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.propose
    ADD FOREIGN KEY (investor_id)
    REFERENCES public."users" (users_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.propose
    ADD FOREIGN KEY (advisor_id)
    REFERENCES public."users" (users_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.propose
    ADD FOREIGN KEY (stock_id)
    REFERENCES public.stock (symbol) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.transaction
    ADD FOREIGN KEY (propose_id)
    REFERENCES public.propose (propose_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.stock_users
    ADD FOREIGN KEY (stock_symbol)
    REFERENCES public.stock (symbol) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.stock_users
    ADD FOREIGN KEY (users_users_id)
    REFERENCES public."users" (users_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.review
    ADD FOREIGN KEY (investor_id)
    REFERENCES public."users" (users_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.review
    ADD FOREIGN KEY (advisor_id)
    REFERENCES public."users" (users_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;