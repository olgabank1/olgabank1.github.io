export const FieldErrors = ({ errors }: { errors?: string[] }) => {
  if (!errors?.length) return null;
  return (
    <div className="flex flex-col gap-0.5 text-xs text-fargeBaer">
      {errors.map((err) => (
        <p key={err}>{err}</p>
      ))}
    </div>
  );
};
