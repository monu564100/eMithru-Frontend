import React, { useEffect, useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import api from "../../utils/axios";
import { useForm } from "react-hook-form";
import { Box, Grid, Card, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FormProvider, RHFTextField } from "../../components/hook-form";

const DEFAULT_VALUES = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  relationWithGuardian: "",
  mobileNumber: "",
  phoneNumber: "",
  residenceAddress: "",
  taluka: "",
  district: "",
  state: "",
  pincode: "",
};

export default function LocalGuardianForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/v1/local-guardians");
        if (response?.data) {
          reset(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        enqueueSnackbar("Failed to fetch data", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reset, enqueueSnackbar]);

  const onSubmit = useCallback(async (formData) => {
    setLoading(true);
    try {
      await api.post("/v1/local-guardians", formData);
      enqueueSnackbar("Form submitted successfully!", { variant: "success" });
      reset(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      enqueueSnackbar("An error occurred while processing the request", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, reset]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {Object.keys(DEFAULT_VALUES).map((field) => (
            <Grid item xs={12} md={field === "residenceAddress" ? 12 : 4} key={field}>
              <RHFTextField 
                name={field} 
                label={field.replace(/([A-Z])/g, " $1").trim()} 
                fullWidth 
                multiline={field === "residenceAddress"} 
                rows={field === "residenceAddress" ? 4 : 1} 
              />
            </Grid>
          ))}
        </Grid>

        <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
          <Box display="flex" gap={1}>
            {import.meta.env.MODE === "development" && (
              <LoadingButton variant="outlined" onClick={() => reset(DEFAULT_VALUES)}>
                Fill Mock Data
              </LoadingButton>
            )}
            <LoadingButton variant="outlined" onClick={() => reset()}>
              Reset
            </LoadingButton>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting || loading}>
              {loading ? "Loading..." : "Save"}
            </LoadingButton>
          </Box>
        </Stack>
      </Card>
    </FormProvider>
  );
}
