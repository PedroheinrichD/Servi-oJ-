type ButtonProps = {
  name: string;
  onclick?: () => void;
};

export function Button({ name, onclick }: ButtonProps) {
  return (
    <button
      onClick={onclick}
      className="text-[0.875rem] w-full py-4 bg-bgMilitar uppercase tracking-widest text-center transition-all duration-300 hover:opacity-90 active:scale-[0.98] text-white cursor-pointer"
      type="submit"
    >
      {name}
    </button>

  );
}
