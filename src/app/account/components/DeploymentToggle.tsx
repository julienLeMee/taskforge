"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function DeploymentToggle() {
  const [isDeploymentsOpen, setIsDeploymentsOpen] = useState(false);

  useEffect(() => {
    const savedPreference = localStorage.getItem("showDeploymentColumn");
    if (savedPreference !== null) {
      setIsDeploymentsOpen(JSON.parse(savedPreference));
    }
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsDeploymentsOpen(checked);
    localStorage.setItem("showDeploymentColumn", JSON.stringify(checked));
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="deployment-toggle"
        checked={isDeploymentsOpen}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="deployment-toggle">Afficher la colonne Déploiement</Label>
    </div>
  );
}
