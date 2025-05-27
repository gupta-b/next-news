
import { useTranslation } from "@/hooks/use-translation";
// need to test
export default function FormattedText(text) {
    const { t } = useTranslation()
    return t(text);
  }
  