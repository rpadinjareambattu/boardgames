import { format } from "date-fns";
const FormattedDate: React.FC<FormattedDateProps> = ({
  isoDateString,
  dateFormat = "yyyy-MM-dd HH:mm:ss",
}) => {
  if (isoDateString === null) return <span>TBD</span>;
  const date = new Date(isoDateString);
  const formattedDate = format(date, dateFormat);
  return <span>{formattedDate}</span>;
};

export default FormattedDate;
interface FormattedDateProps {
  isoDateString: string;
  dateFormat?: string;
}
