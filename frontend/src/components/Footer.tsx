import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <section>
      <div className="container mx-auto">
        <footer>
          <div className=" flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
            <div>
              <img src={assets.logo} className=" mb-5 w-32" alt="" />
              <p className=" w-full md:w-2/3 text-gray-600">
                Your one-stop destination for premium shopping. Explore
                thousands of products across fashion, electronics, home decor,
                and more. Enjoy secure checkout, free shipping on qualifying
                orders, and 24/7 customer support. Shop with confidence — we've
                got you covered.
              </p>
            </div>
            <div>
              <p className=" text-xl font-medium mb-5">COMPANY</p>
              <ul className=" flex flex-col gap-1 text-gray-600">
                <li>Home</li>
                <li>About us</li>
                <li> Delivery</li>
                <li>Privacy policy</li>
              </ul>
            </div>
            <div>
              <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
              <ul className=" flex flex-col gap-1 text-gray-600">
                <li>+1-212-456-7890</li>
                <li>moazkassim100@gmail.com</li>
              </ul>
            </div>
          </div>
          <div>
            <hr className="my-4 border-gray-300" />

            <p className=" py-5 text-sm text-center">
              Copyright 2026@ forever.com -All Right Reserved
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
