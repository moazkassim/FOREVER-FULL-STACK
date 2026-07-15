import { assets } from "../assets/assets";

const OurPolicy = () => {
  const policies = [
    {
      icon: assets.exchange_icon,
      title: "Easy Exchange Policy",
      description: "Hassle-free exchanges within 30 days of purchase.",
    },
    {
      icon: assets.quality_icon,
      title: "7 Days Return Policy",
      description:
        "Not satisfied? Return any item within 7 days, no questions asked.",
    },
    {
      icon: assets.support_img,
      title: "24/7 Customer Support",
      description: "Our team is here to help you anytime, day or night.",
    },
  ];
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
      {policies.map((policy) => (
        <div key={policy.title}>
          <img
            src={policy.icon}
            className="w-12 m-auto mb-5"
            alt={policy.title}
          />
          <p className="font-semibold">{policy.title}</p>
          <p className="text-gray-400">{policy.description}</p>
        </div>
      ))}
    </div>
  );
};

export default OurPolicy;
