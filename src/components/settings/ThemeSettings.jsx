import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import { Check, Palette, Type } from "lucide-react";
import { useThemeContext } from "../theme/ThemeProvider";

export function ThemeSettings({ onClose }) {
  const {
    primaryColor,
    secondaryColor,
    fontFamily,
    setPrimaryColor,
    setSecondaryColor,
    setFontFamily,
  } = useThemeContext();

  const [tempPrimary, setTempPrimary] = useState(primaryColor);
  const [tempSecondary, setTempSecondary] = useState(secondaryColor);
  const [tempFont, setTempFont] = useState(fontFamily);

  const colorOptions = [
    { label: "Gold", primary: "#B38A2D", secondary: "#E1BE5D" },
    { label: "Blue", primary: "#2563EB", secondary: "#60A5FA" },
    { label: "Green", primary: "#059669", secondary: "#34D399" },
    { label: "Purple", primary: "#7C3AED", secondary: "#A78BFA" },
    { label: "Rose", primary: "#E11D48", secondary: "#FB7185" },
  ];

  const fontOptions = [
    { value: "Inter, sans-serif", label: "Inter" },
    { value: "Poppins, sans-serif", label: "Poppins" },
    { value: "Roboto, sans-serif", label: "Roboto" },
    { value: "Montserrat, sans-serif", label: "Montserrat" },
    { value: "System, sans-serif", label: "System UI" },
  ];

  const handleApply = () => {
    setPrimaryColor(tempPrimary);
    setSecondaryColor(tempSecondary);
    setFontFamily(tempFont);
    toast.success("Theme settings updated");
    if (onClose) onClose();
  };

  return (
    <div className="p-1">
      <h2 className="text-2xl font-bold mb-4">Appearance Settings</h2>

      <Tabs defaultValue="colors">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="colors">
            <Palette className="mr-2 h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography">
            <Type className="mr-2 h-4 w-4" />
            Typography
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Theme Presets</label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => {
                      setTempPrimary(option.primary);
                      setTempSecondary(option.secondary);
                    }}
                    className="w-full aspect-square rounded-md flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: option.primary }}
                  >
                    {tempPrimary === option.primary && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Primary Color</label>
              <div className="flex mt-2 gap-2">
                <div
                  className="w-10 h-10 rounded-md"
                  style={{ backgroundColor: tempPrimary }}
                />
                <Input
                  value={tempPrimary}
                  onChange={(e) => setTempPrimary(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Secondary Color</label>
              <div className="flex mt-2 gap-2">
                <div
                  className="w-10 h-10 rounded-md"
                  style={{ backgroundColor: tempSecondary }}
                />
                <Input
                  value={tempSecondary}
                  onChange={(e) => setTempSecondary(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <div>
            <label className="text-sm font-medium">Font Family</label>
            <Select
              value={tempFont}
              className="w-full"
              onValueChange={setTempFont}
            >
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Preview</label>
            <div
              className="mt-2 p-4 border rounded-md"
              style={{ fontFamily: tempFont }}
            >
              <h3 className="text-lg font-bold">The quick brown fox</h3>
              <p>Jumps over the lazy dog. 1234567890</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleApply}>Apply Changes</Button>
      </div>
    </div>
  );
}
