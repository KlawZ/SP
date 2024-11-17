CREATE TABLE IF NOT EXISTS public.posts
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
    balance double precision,
    PRIMARY KEY (users_id)
);

CREATE TABLE IF NOT EXISTS public.stocks
(
    symbol text NOT NULL,
    name text NOT NULL,
    market text NOT NULL,
    sector text NOT NULL,
    current_price double precision NOT NULL,
    "time" timestamp(6) without time zone NOT NULL,
    PRIMARY KEY (symbol)
);

CREATE TABLE IF NOT EXISTS public.proposals
(
    proposal_id serial NOT NULL,
    content text,
    accepted boolean NOT NULL,
    quantity integer NOT NULL,
    stock_id text NOT NULL,
    advisor_id integer NOT NULL,
    investor_id integer NOT NULL,
    type text NOT NULL
    PRIMARY KEY (proposal_id)
);

CREATE TABLE IF NOT EXISTS public.transactions
(
    transaction_id serial NOT NULL,
    amount integer NOT NULL,
    type text NOT NULL,
    proposal_id integer NOT NULL,
    PRIMARY KEY (transaction_id)
);

CREATE TABLE IF NOT EXISTS public.stock_users
(
    stock_symbol text NOT NULL,
    users_id integer NOT NULL,
    quantity integer NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reviews
(
    review_id serial NOT NULL,
    investor_id integer NOT NULL,
    advisor_id integer NOT NULL,
    rating integer NOT NULL,
    feedback text,
    PRIMARY KEY (review_id)
);

ALTER TABLE IF EXISTS public.posts
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


ALTER TABLE IF EXISTS public.proposals
    ADD FOREIGN KEY (investor_id)
    REFERENCES public."users" (users_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.proposals
    ADD FOREIGN KEY (advisor_id)
    REFERENCES public."users" (users_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.proposals
    ADD FOREIGN KEY (stock_id)
    REFERENCES public.stocks (symbol) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.transactions
    ADD FOREIGN KEY (proposal_id)
    REFERENCES public.proposals (proposal_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.stock_users
    ADD FOREIGN KEY (stock_symbol)
    REFERENCES public.stocks (symbol) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.stock_users
    ADD FOREIGN KEY (users_id)
    REFERENCES public."users" (users_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE stock_users
ADD CONSTRAINT unique_user_stock UNIQUE (users_id, stock_symbol);

ALTER TABLE IF EXISTS public.reviews
    ADD FOREIGN KEY (investor_id)
    REFERENCES public."users" (users_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.reviews
    ADD FOREIGN KEY (advisor_id)
    REFERENCES public."users" (users_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;