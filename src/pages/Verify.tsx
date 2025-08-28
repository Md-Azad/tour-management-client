import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dot } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import {
  useSendOTPMutation,
  useVerifyOTPMutation,
} from "@/redux/features/auth/auth.api";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

const Verify = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  //   const form = useForm();
  const location = useLocation();
  //   const navigate = useNavigate();
  const [email] = useState(location.state);
  const [confirmed, setConfirmed] = useState(false);
  const [sendOTP] = useSendOTPMutation();
  const [verifyOTP] = useVerifyOTPMutation();
  const [time, setTime] = useState(8);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  //   useEffect(() => {
  //     if (!email) {
  //       navigate("/");
  //     }
  //   }, [email, navigate]);

  useEffect(() => {
    // Start timer only if confirmed and time > 0
    if (confirmed && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup on unmount or when time changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [confirmed, time]);

  const handleConfirm = async () => {
    const toastId = toast.loading("sending OTP");
    try {
      const res = await sendOTP({ email: email }).unwrap();

      if (res.success) {
        toast.success("OTP sent", { id: toastId });
        setConfirmed(true);
        setTime(8);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const toastId = toast.loading("Verifing OTP");
    const otpInfo = {
      email,
      otp: data.pin,
    };

    const res = await verifyOTP(otpInfo).unwrap();

    if (res.success) {
      toast.success("OTP Verified", { id: toastId });
    }
  };
  return (
    <div className="grid place-content-center h-screen">
      {confirmed ? (
        <Card className="w-full ">
          <CardHeader>
            <CardTitle>Verify your email address</CardTitle>
            <CardDescription>
              Please enter your 6 digit code that we sent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id="otp-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className=" space-y-6"
              >
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={1} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <Dot />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>
                        <Button
                          disabled={time > 0}
                          variant="link"
                          type="button"
                          onClick={handleConfirm}
                          className={cn("p-0 m-0", {
                            "cursor-pointer": time === 0,
                            "text-gray-600": time !== 0,
                          })}
                        >
                          Resend OTP
                        </Button>
                        {time}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button form="otp-form" type="submit" className="w-full">
              Submit
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-full ">
          <CardHeader className="w-[400px]">
            <CardTitle>Verify your email address</CardTitle>
            <CardDescription>We will send your code at {email}</CardDescription>
          </CardHeader>

          <CardFooter className="flex-col gap-2">
            <Button onClick={handleConfirm} className="w-[300px]">
              Confirm
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Verify;
