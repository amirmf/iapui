import { AgentUserSignupForm } from '@features/agent-users/components/agent-user-signup-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@iap/ui'
import { useTranslation } from 'react-i18next'

import styles from './agent-user-signup-page.module.css'

export default function AgentUserSignupPage() {
  const { t } = useTranslation()
  return (
    <main className={cn('container mx-auto w-full max-w-xl pb-5', styles.page)}>
      <Card className='border-border'>
        <CardHeader>
          <CardTitle as='div'>{t('agent.users.title')}</CardTitle>
          <CardDescription as='div'>
            {t('agent.users.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AgentUserSignupForm />
        </CardContent>
      </Card>
    </main>
  )
}
