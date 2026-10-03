import PasswordResetOtpSection from '@features/otp/components/password-reset-otp-section'
import SignupOtpSection from '@features/otp/components/signup-otp-section'

export default function OtpPage() {
  return (
    <section className='flex w-full flex-col rounded-[20px] bg-card px-6 py-6 text-foreground shadow-sm peer-[.header-fixed]/header:mt-16 sm:px-8 sm:py-8'>
      <SignupOtpSection />
      <PasswordResetOtpSection />
    </section>
  )
}
