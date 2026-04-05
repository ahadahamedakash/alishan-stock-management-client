import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CardWrapper({ title, children }) {
  return (
    <Card className="w-full mx-auto shadow-md border rounded-2xl pb-8">
      {title && (
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
