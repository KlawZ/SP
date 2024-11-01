-- Create the trigger function to notify on price changes
CREATE OR REPLACE FUNCTION stock_price_change() RETURNS TRIGGER AS $$
BEGIN
    -- Only send a notification if the price has changed
    IF NEW.current_price IS DISTINCT FROM OLD.current_price THEN
        PERFORM pg_notify('stock_price_changes', json_build_object(
			'symbol', NEW.symbol,
            'current_price', NEW.current_price
        )::text);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on the stocks table
CREATE TRIGGER stock_price_change_trigger
AFTER UPDATE ON public.stocks
FOR EACH ROW EXECUTE FUNCTION stock_price_change();