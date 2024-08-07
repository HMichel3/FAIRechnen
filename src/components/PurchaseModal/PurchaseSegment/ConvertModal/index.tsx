import { IonButton, IonInput } from "@ionic/react";
import { useState } from "react";
import { displayCurrencyValue } from "../../../../App/utils";
import { usePersistedStore } from "../../../../stores/usePersistedStore";
import { useStore } from "../../../../stores/useStore";
import { CurrencyInput } from "../../../noFormComponents/CurrencyInput";
import {
  NumberInput,
  parseCommaNumber,
} from "../../../noFormComponents/NumberInput";

type ConvertModalProps = {
  setFormAmount: (amount: number) => void;
  onDismiss: () => void;
};

export const ConvertModal = ({
  setFormAmount,
  onDismiss,
}: ConvertModalProps) => {
  const { id: groupId, factor = "1" } = useStore((s) => s.selectedGroup);
  const setGroupFactor = usePersistedStore((s) => s.setGroupFactor);
  const [amount, setAmount] = useState(0);

  function onSave() {
    setFormAmount(Math.round(amount * parseCommaNumber(factor)));
    onDismiss();
  }

  return (
    <>
      <div className="absolute inset-0 z-10 bg-black/60" onClick={onDismiss} />
      <div className="absolute bottom-0 left-4 right-4 top-0 z-20 my-auto h-fit rounded bg-[rgb(18,18,18)] p-4">
        <div className="flex flex-col justify-center">
          <h3 className="mb-4 text-center text-xl">Betrag umrechnen</h3>
          <div>
            <CurrencyInput label="Betrag" value={amount} onChange={setAmount} />
            <NumberInput
              label="Umrechnungsfaktor"
              value={factor}
              onChange={(value) => setGroupFactor(groupId, value)}
            />
            <IonInput
              fill="solid"
              labelPlacement="floating"
              label="Wert"
              value={displayCurrencyValue(amount * parseCommaNumber(factor))}
              readonly
            />
          </div>
          <IonButton className="mx-0 mt-4" type="button" onClick={onSave}>
            Übernehmen
          </IonButton>
        </div>
      </div>
    </>
  );
};
