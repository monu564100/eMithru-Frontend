import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import api from "../../utils/axios";
import { useForm, useWatch } from "react-hook-form";
import { Box, Grid, Card, Stack, FormControlLabel, Switch } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FormProvider, RHFTextField } from "../../components/hook-form";

const DEFAULT_VALUES = {
  currentAddress: {
    line1: "",
    line2: "",
    country: "",
    state: "",
    city: "",
    district: "",
    taluka: "",
    pincode: "",
    phoneNumber: "",
  },
  permanentAddress: {
    line1: "",
    line2: "",
    country: "",
    state: "",
    city: "",
    district: "",
    taluka: "",
    pincode: "",
    phoneNumber: "",
  },
};

export default function ContactDetails({ userId }) {
  const { enqueueSnackbar } = useSnackbar();
  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  const methods = useForm({ defaultValues: DEFAULT_VALUES });
  const { handleSubmit, reset, setValue, formState: { isSubmitting } } = methods;

  // Fetch data from backend when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/v1/contact-details/${userId}`);
        console.log("Fetched data:", response.data); // Debugging
        reset(response.data); // Fill form with fetched data
      } catch (error) {
        console.error("Error fetching contact details:", error);
        enqueueSnackbar("Failed to load contact details", { variant: "error" });
      }
    };

    if (userId) fetchData();
  }, [userId, reset, enqueueSnackbar]);

  // Handle Same As Current Switch
  const handleSwitchChange = (event) => {
    setSameAsCurrent(event.target.checked);
    if (event.target.checked) {
      setValue("permanentAddress", methods.getValues("currentAddress"), { shouldValidate: true });
    } else {
      setValue("permanentAddress", DEFAULT_VALUES.permanentAddress, { shouldValidate: true });
    }
  };

  // Submit Form Data
  const onSubmit = async (formData) => {
    try {
      await api.post("/v1/contact-details", { userId, ...formData });
      enqueueSnackbar("Form submitted successfully!", { variant: "success" });
      reset(formData);
    } catch (error) {
      console.error("Submission Error:", error);
      enqueueSnackbar("An error occurred while processing the request", { variant: "error" });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {/* Current Address */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <h3>Current Address:</h3>
              {Object.keys(DEFAULT_VALUES.currentAddress).map((field) => (
                <RHFTextField key={field} name={`currentAddress.${field}`} label={field.replace(/([A-Z])/g, ' $1').trim()} fullWidth required />
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Permanent Address */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <h3>
                Permanent Address:
                <FormControlLabel
                  sx={{ float: "right" }}
                  control={<Switch checked={sameAsCurrent} onChange={handleSwitchChange} />}
                  label="Same as Current"
                />
              </h3>
              {Object.keys(DEFAULT_VALUES.permanentAddress).map((field) => (
                <RHFTextField key={field} name={`permanentAddress.${field}`} label={field.replace(/([A-Z])/g, ' $1').trim()} fullWidth required />
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Buttons */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <LoadingButton variant="outlined" onClick={() => reset(DEFAULT_VALUES)} disabled={isSubmitting}>
              Reset
            </LoadingButton>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Save
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
