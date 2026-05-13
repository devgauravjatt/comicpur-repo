import { AArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function SectionCards({
  homeStatus,
}: {
  homeStatus: {
    totalUsers: number;
    totalPremiumUsers: number;
    totalComics: number;
  };
}) {
  const { totalPremiumUsers, totalUsers, totalComics } = homeStatus;
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{totalUsers}</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <AArrowDown />+{totalUsers / 100}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">this is count of totalUsers</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Premium Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalPremiumUsers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <AArrowDown />+{totalPremiumUsers / 100}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">this is count of totalPremiumUsers</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Comics</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{totalComics}</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <AArrowDown />+{totalComics / 100}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">this is count of totalComics</div>
        </CardFooter>
      </Card>
    </div>
  );
}
