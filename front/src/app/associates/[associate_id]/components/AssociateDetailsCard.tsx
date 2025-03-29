import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFetchAssociate } from "@/hooks/associates/useFetchAssociate";
import { motion } from "motion/react";

interface AssociateDetailsCardProps {
  associateId: string;
}

export default function AssociateDetailsCard({
  associateId,
}: AssociateDetailsCardProps) {
  const { data, isLoading } = useFetchAssociate({ id: associateId });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="overflow-x-hidden col-span-2 lg:col-span-3"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Associate Details{" "}
            <Button variant="ghost" size="icon">
              <Edit />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && !data && (
            <div className="flex items-center justify-center h-full">
              Some error occurred while fetching associate details.
            </div>
          )}
          {!isLoading && data && (
            <>
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">{data.fullName}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex flex-col gap-2 w-full lg:max-w-55">
                    <Label>Registration</Label>
                    <Input value={data.id} readOnly disabled />
                  </div>
                  <div className="flex flex-col gap-2 w-full lg:w-fit">
                    <Label>Phone</Label>
                    <Input value={data.phone} readOnly disabled />
                  </div>
                  <div className="flex flex-col gap-2 w-full lg:w-fit">
                    <Label>Email</Label>
                    <Input value={data.email} readOnly disabled />
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
