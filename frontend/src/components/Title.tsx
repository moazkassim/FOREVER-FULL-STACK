interface Title {
  text1: string;
  text2: string;
}
const Title = ({ text1, text2 }: Title) => {
  return (
    <div className=" inline-flex gap-2 items-center mb-3">
      <p className=" text-muted-foreground">
        {text1} <span className=" text-foreground font-medium">{text2}</span>
      </p>
      <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-foreground"></p>
    </div>
  );
};

export default Title;
