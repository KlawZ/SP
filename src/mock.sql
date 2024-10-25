--first
/*-- Inserting mock data into the "users" table
INSERT INTO public."users" (name, password, role, balance) VALUES
18('Alice Smith', 'password123', 'investor', 10000),
19('Bob Johnson', 'password456', 'advisor', null),
20('Charlie Brown', 'password789', 'investor', 20000),
21('Dana White', 'password321', 'advisor', null),
22('Eva Green', 'password654', 'administrator', null);

-- Inserting mock data into the "stocks" table
INSERT INTO public.stocks (symbol, name, market, sector, current_price, "time") VALUES
('AAPL', 'Apple Inc.', 'NASDAQ', 'Technology', 14.30, NOW()),
('GOOGL', 'Alphabet Inc.', 'NASDAQ', 'Technology', 27.00, NOW()),
('AMZN', 'Amazon.com, Inc.', 'NASDAQ', 'Consumer Discretionary', 33.00, NOW()),
('TSLA', 'Tesla, Inc.', 'NASDAQ', 'Automotive', 72.00, NOW()),
('MSFT', 'Microsoft Corporation', 'NASDAQ', 'Technology', 13.00, NOW());
*/

-- second
/*-- Inserting mock data into the "posts" table
INSERT INTO public.posts (content, upvotes, downvotes, advisor_id) VALUES
('The future of technology is bright!', 10, 2, 19),
('Investing in stocks requires patience.', 8, 1, 21),
('Diversification is key to a healthy portfolio.', 12, 0, 19),
('Cryptocurrency is a risky investment.', 15, 3, 21),
('Understanding market trends is essential.', 9, 4, 19);
*/

-- third
/*
-- Inserting mock data into the "reviews" table
INSERT INTO public.reviews (investor_id, advisor_id, rating, feedback) VALUES
(18, 19, 5, 'Great advice on tech stocks!'),
(20, 21, 4, 'Helpful in understanding the market.'),
(18, 19, 5, 'Excellent service!'),
(20, 21, 3, 'Good, but can improve.'),
(18, 19, 2, 'Not very helpful with my investments.');
*/

--fourth

/*
-- Inserting mock data into the "proposals" table
INSERT INTO public.proposals (content, accepted, quantity, stock_id, advisor_id, investor_id, type) VALUES
('Invest in Apple stock', true, 100, 'AAPL', 19, 18, 'buy'),
('Invest in Tesla stock', false, 50, 'TSLA', 21, 20, 'buy'),
('Invest in Amazon stock', true, 75, 'AMZN', 19, 18, 'sell'),
('Invest in Google stock', true, 10, 'GOOGL', 21, 20, 'buy'),
('Invest in Microsoft stock', true, 30, 'MSFT', 19, 18, 'buy');
*/

--fifth
/*
-- Inserting mock data into the "transactions" table
INSERT INTO public.transactions (amount, type, proposal_id) VALUES
(143, 'buy', 3),
(2475, 'sell', 5),
(270, 'buy', 6),
(390, 'buy', 7);
*/

--sixth
/*
-- Inserting mock data into the "stock_users" table
INSERT INTO public.stock_users (stock_symbol, users_id, quantity) VALUES
('AAPL', 18, 100),
('GOOGL', 20, 10),
('MSFT', 18, 30);
*/
