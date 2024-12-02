import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, action }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
