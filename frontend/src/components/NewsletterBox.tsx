import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NewsletterBox = () => {
  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  return (
    <section className="text-center py-16">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe & Get 20% Off
      </p>
      <p className="text-gray-400 mt-3 max-w-md mx-auto">
        Be the first to know about new arrivals, exclusive deals, and style
        inspiration.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center mx-auto my-6"
      >
        <Input
          type="email"
          placeholder="Enter your email"
          required
          className="flex-1 rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          type="submit"
          className="rounded-l-none px-10 py-4 cursor-pointer"
        >
          SUBSCRIBE
        </Button>
      </form>
    </section>
  );
};

export default NewsletterBox;
