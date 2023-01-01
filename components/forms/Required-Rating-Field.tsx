import { FormikHandlers, FormikValues } from "formik";

const RequiredRatingField = ({
  label,
  onBlur,
  onChange,
  formikValues,
  commentValueName,
  ratingValueName,
}: {
  formikValues: FormikValues;
  onBlur: FormikHandlers["handleBlur"];
  onChange: FormikHandlers["handleChange"];
  commentValueName: string;
  ratingValueName: string;
  label: string;
}) => {
  return (
    <div className='my-4 border-2 p-4 rounded-sm shadow-md'>
      <p className='font-Poppins text-1xl sm:text-2xl'>{label.charAt(0).toUpperCase() + label.slice(1)}</p>
      <p className='inline mr-4'>Rating (1-5) :</p>
      <input
        aria-label={label + "Rating (1-5)"}
        type='number'
        className='w-[40px] text-center my-2 p-2 bg-inputPri focus:bg-white rounded-md tracking-wide font-Poppins'
        min={1}
        max={5}
        name={ratingValueName}
        id={ratingValueName}
        value={formikValues[ratingValueName]}
        onBlur={onBlur}
        onChange={onChange}
      />
      <input
        type='text'
        className='w-[100%] mb-4 p-2 bg-inputPri focus:bg-white rounded-md tracking-wide font-Poppins'
        placeholder='comment'
        name={commentValueName}
        id={commentValueName}
        value={formikValues[commentValueName]}
        onBlur={onBlur}
        onChange={onChange}
      />
    </div>
  );
};

export default RequiredRatingField;
