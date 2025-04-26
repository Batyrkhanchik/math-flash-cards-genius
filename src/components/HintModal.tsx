
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Lightbulb } from "lucide-react";

interface HintModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  hint: string;
}

const HintModal = ({ isOpen, setIsOpen, hint }: HintModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-math-purple" />
            <span>Подсказка</span>
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {hint}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default HintModal;
