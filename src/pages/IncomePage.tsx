import { zodResolver } from '@hookform/resolvers/zod'
import { IonContent, IonLabel, IonPage } from '@ionic/react'
import { calculatorSharp } from 'ionicons/icons'
import { useForm } from 'react-hook-form'
import { RouteComponentProps } from 'react-router'
import { pick } from 'remeda'
import { z } from 'zod'
import { AlertModal } from '../components/modals/AlertModal'
import { ConvertModal } from '../components/modals/ConvertModal'
import { FormCheckboxGroup } from '../components/ui/formComponents/FormCheckboxGroup'
import { FormCurrency } from '../components/ui/formComponents/FormCurrency'
import { FormInput } from '../components/ui/formComponents/FormInput'
import { FormRadioGroup } from '../components/ui/formComponents/FormRadioGroup'
import { FormTextarea } from '../components/ui/formComponents/FormTextarea'
import { IconButton } from '../components/ui/IconButton'
import { PageFooter } from '../components/ui/PageFooter'
import { PageHeader } from '../components/ui/PageHeader'
import { useDismiss } from '../hooks/useDissmiss'
import { useOverlay } from '../hooks/useOverlay'
import { usePersistedStore } from '../stores/usePersistedStore'
import { useStore } from '../stores/useStore'
import { NewIncome } from '../types/common'
import { Income, Member } from '../types/store'
import { cn, findItem } from '../utils/common'

export type IncomeFormPropertyName = 'name' | 'amount' | 'earnerId' | 'beneficiaryIds' | 'description'

type IncomePageProps = RouteComponentProps<{
  id: string
  incomeId?: string
}>

const validationSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number().positive(),
  earnerId: z.string().min(1),
  beneficiaryIds: z.string().array().nonempty(),
  description: z.string(),
})

const defaultValues = (members: Member[], selectedIncome?: Income): NewIncome => {
  if (!selectedIncome) {
    const memberIds = members.map(member => member.id)
    return {
      name: '',
      amount: 0,
      earnerId: memberIds[0],
      beneficiaryIds: memberIds,
      description: '',
    }
  }

  return pick(selectedIncome, ['name', 'amount', 'earnerId', 'beneficiaryIds', 'description'])
}

export const IncomePage = ({
  match: {
    params: { id: groupId, incomeId },
  },
}: IncomePageProps) => {
  const { members, incomes } = useStore(s => s.selectedGroup)
  const addIncome = usePersistedStore(s => s.addIncome)
  const editIncome = usePersistedStore(s => s.editIncome)
  const showAnimation = useStore(s => s.showAnimation)
  const selectedIncome = findItem(incomeId, incomes)
  const { handleSubmit, formState, control, setValue } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues(members, selectedIncome),
  })
  const convertOverlay = useOverlay<IncomeFormPropertyName>()
  const onDismiss = useDismiss(`/groups/${groupId}`)

  const onSubmit = handleSubmit(newIncome => {
    if (selectedIncome) {
      editIncome(groupId, selectedIncome.id, newIncome)
    } else {
      addIncome(groupId, newIncome)
    }
    showAnimation()
    onDismiss()
  })

  return (
    <IonPage>
      <PageHeader title={selectedIncome ? 'Einkommen bearbeiten' : 'Neues Einkommen'} onDismiss={onDismiss} />
      <IonContent>
        <form id='income-form' onSubmit={onSubmit}>
          <div className='my-2 flex flex-col gap-2'>
            <FormInput label='Einkommenname*' name='name' control={control} />
            <div className='flex'>
              <FormCurrency label='Betrag*' name='amount' control={control} />
              <IconButton icon={calculatorSharp} size='large' onClick={() => convertOverlay.onSelect('amount')} />
            </div>
            <div className='flex flex-col border-b border-[#898989] bg-[#1e1e1e] px-4 py-2'>
              <IonLabel className='text-xs'>Verdiener*</IonLabel>
              <FormRadioGroup name='earnerId' control={control} selectOptions={members} />
            </div>
            <div
              className={cn('flex flex-col border-b border-[#898989] bg-[#1e1e1e] px-4 py-2', {
                'border-[#eb445a]': formState.errors.beneficiaryIds,
              })}
            >
              <IonLabel className='text-xs' color={cn({ danger: formState.errors.beneficiaryIds })}>
                Beteiligte*
              </IonLabel>
              <FormCheckboxGroup name='beneficiaryIds' control={control} selectOptions={members} />
            </div>
            <FormTextarea label='Beschreibung' name='description' control={control} />
          </div>
        </form>
      </IonContent>
      <PageFooter form='income-form'>Einkommen speichern</PageFooter>
      <AlertModal
        overlay={convertOverlay}
        component={ConvertModal}
        componentProps={{ onSubmit: amount => setValue(convertOverlay.selected!, amount) }}
      />
    </IonPage>
  )
}
