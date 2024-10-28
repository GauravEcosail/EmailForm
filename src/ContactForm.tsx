import {
  Box,
  Card,
  CardContent,
  FormGroup,
  TextField,
  Typography,
  Stack,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { ErrorMessage, Field, Form, Formik, useField } from "formik";
import * as Yup from "yup";
import emailjs from "@emailjs/browser";
import Values from "./values";
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const initialValue: Values = {
  name: "",
  companyname: "",
  email: "",
  phone: "",
  countrycode: 91,
  message: "",
  interestedservice: [],
};

function ContactForm() {
  const sendEmail = (values: Values) => {
    const templateParams = {
      name: values.name,
      companyname: values.companyname,
      email: values.email,
      phone: values.phone,
      countrycode: values.countrycode,
      interestedservice: values.interestedservice.join(", "),
      message: values.message,
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY).then(
      () => {
        console.log("SUCCESS!");
        alert("Email sent successfully!");
      },
      (error) => {
        console.log("FAILED...", error);
      }
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" margin={2}>
          Contact Form
        </Typography>
        <Formik
          validationSchema={Yup.object({
            name: Yup.string().required("Name is required"),
            companyname: Yup.string().required("Company Name is required"),
            email: Yup.string()
              .required("Email is required")
              .email("Invalid email"),
            phone: Yup.string()
              .required("Phone is required")
              .matches(/^\d+$/, "Phone must contain only digits")
              .min(10, "Phone must be at least 10 digits"),
            countrycode: Yup.number().required("Country Code is required"),
            message: Yup.string().notRequired(),
            interestedservice: Yup.array()
              .of(Yup.string())
              .min(1, "Please select at least one service"),
          })}
          initialValues={initialValue}
          onSubmit={(values) => {
            console.log("Form submitted:", JSON.stringify(values, null, 2));
            sendEmail(values);
          }}
        >
          {() => (
            <Form>
              <Box sx={{ mb: 2 }}>
                <FormGroup>
                  <Field
                    name="name"
                    type="text"
                    label="Name"
                    variant="outlined"
                    as={TextField}
                  />
                  <ErrorMessage name="name" component="div" />
                </FormGroup>
              </Box>
              <Box sx={{ mb: 2 }}>
                <FormGroup>
                  <Field
                    name="companyname"
                    type="text"
                    label="Company Name"
                    variant="outlined"
                    as={TextField}
                  />
                  <ErrorMessage name="companyname" component="div" />
                </FormGroup>
              </Box>
              <Box sx={{ mb: 2 }}>
                <FormGroup>
                  <Field
                    name="email"
                    type="email"
                    label="Email"
                    variant="outlined"
                    as={TextField}
                  />
                  <ErrorMessage name="email" component="div" />
                </FormGroup>
              </Box>
              <Box sx={{ mb: 2 }}>
                <FormGroup>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Field
                      name="countrycode"
                      type="number"
                      label="Country Code"
                      variant="outlined"
                      as={TextField}
                      inputProps={{
                        style: { fontSize: "0.875rem", width: "70px" },
                      }}
                    />
                    <Field
                      name="phone"
                      type="number"
                      label="Phone"
                      variant="outlined"
                      as={TextField}
                      inputProps={{ style: { width: "150%" } }}
                    />
                  </Stack>
                  <ErrorMessage name="countrycode" component="div" />
                  <ErrorMessage name="phone" component="div" />
                </FormGroup>
              </Box>
              <Typography variant="h6" component="div">
                Interested Services
              </Typography>
              <MyCheckBox
                name="interestedservice"
                label="Compliance Modules"
                value="Compliance-Modules"
              />
              <MyCheckBox
                name="interestedservice"
                label="Performance Modules"
                value="Performance-Modules"
              />
              <MyCheckBox
                name="interestedservice"
                label="Management Modules"
                value="Management-Modules"
              />
              <MyCheckBox
                name="interestedservice"
                label="Custom Modules"
                value="CustomModules"
              />
              <Typography variant="h6" component="div">
                Leave a Message
              </Typography>
              <Box sx={{ mb: 2 }}>
                <FormGroup>
                  <Field
                    name="message"
                    type="text"
                    label="Message"
                    variant="outlined"
                    as={TextField}
                    multiline
                    rows={4}
                  />
                  <ErrorMessage name="message" component="div" />
                </FormGroup>
              </Box>

              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}

export default ContactForm;

interface MyCheckBoxProps {
  name: string;
  value?: string;
  label: string;
}

export function MyCheckBox({ label, ...props }: MyCheckBoxProps) {
  const [field] = useField({ ...props, type: "checkbox" });
  return <FormControlLabel control={<Checkbox {...field} />} label={label} />;
}
