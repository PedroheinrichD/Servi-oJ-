type ButtonProps = {
  name: string;
};

export function Button({ name }: ButtonProps) {
  return (
    <button
      className="text-[0.875rem] w-full py-4 bg-bgMilitar uppercase tracking-widest text-center transition-all duration-300 hover:opacity-90 active:scale-[0.98] text-white cursor-pointer"
      type="submit"
    >
      {name}
    </button>
  );
}
