"use client";

import React from "react";
import AssociateDetailsCard from "./components/AssociateDetailsCard";
import AssociateMensalitiesTable from "./components/AssociateMensalitiesTable";

export default function AssociateProfilePage({
  params,
}: {
  params: Promise<{ associate_id: string }>;
}) {
  const resolvedParams = React.use(params);
  const associateId = resolvedParams.associate_id;

  return (
    <div className="gap-6 flex flex-col md:grid md:grid-cols-4">
      <AssociateDetailsCard associateId={associateId} />
      <AssociateMensalitiesTable associateId={associateId} />
    </div>
  );
}
