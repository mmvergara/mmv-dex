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
    <div className='my-4'>
      <p className='font-Poppins text-1xl sm:text-2xl'>{label.charAt(0).toUpperCase() + label.slice(1)}</p>
      <label htmlFor='presentation_score_rating'>Rating: </label>
      <input
        type='number'
        className='w-[50px] my-2 p-2 bg-inputPri focus:bg-white rounded-md tracking-wide font-Poppins'
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
        placeholder='Comment'
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
