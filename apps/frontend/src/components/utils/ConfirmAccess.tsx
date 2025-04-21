

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Collaborator } from "@/types/types";


export interface ModalData {
  title: string;
  description1: string;
  description2?: string;
  buttonText: string;
  onConfirm: (collaborator?: Collaborator) => void;
  collaborator?: Collaborator;
}

interface AddSecretPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modalData: ModalData;
}


const ConfirmAccess = ({open, onOpenChange, modalData}: AddSecretPopupProps) => {
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span>{modalData.title}</span>
          </DialogTitle>
          <DialogDescription>
            {modalData.description1}
          </DialogDescription>
        </DialogHeader>
        <div>
          <p>{modalData.description2}</p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className={`${modalData.buttonText === "Logout" ? "bg-destructive" : ""}`} onClick={() => (
            modalData?.onConfirm(modalData?.collaborator),
            onOpenChange(false)
          )}>{modalData.buttonText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export default ConfirmAccess;
