"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    id: 1,
    user: "John Doe",
    action: "Purchased Pro Plan",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "Upgraded Account",
    time: "4 hours ago",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "Added Payment Method",
    time: "6 hours ago",
  },
  {
    id: 4,
    user: "Sarah Williams",
    action: "Created New Workspace",
    time: "8 hours ago",
  },
  {
    id: 5,
    user: "Tom Brown",
    action: "Invited Team Members",
    time: "10 hours ago",
  },
];

export function RecentActivity() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div>
                <p className="font-medium text-foreground">{activity.user}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.action}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
