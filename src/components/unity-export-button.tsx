import { useState } from "react";
import { Button } from "./ui/button";
import { Download, FileCode, Database, Image, Gamepad2 } from "lucide-react";
import { unityExporter } from "@/utils/unity-export";
import { useToast } from "./ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function UnityExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = await unityExporter.downloadExport();
      
      toast({
        title: "Unity Export Complete!",
        description: "Downloaded JSON data and C# scripts for Unity conversion.",
      });

      // Show export summary
      console.log("Unity Export Summary:", {
        trainers: exportData.gameData.trainers.length,
        battleRequests: exportData.gameData.battleRequests.length,
        components: exportData.uiStructure.components.length,
        pages: exportData.uiStructure.pages.length
      });

    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="h-5 w-5" />
          Unity Export
        </CardTitle>
        <CardDescription>
          Export all your battle frontier data, game logic, and UI structure for Unity development
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <span>Game Data</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-primary" />
            <span>C# Scripts</span>
          </div>
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4 text-primary" />
            <span>Assets List</span>
          </div>
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-primary" />
            <span>UI Structure</span>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
          <p className="font-medium">Export includes:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>All trainer data and battle requests from Supabase</li>
            <li>Complete C# scripts for Unity integration</li>
            <li>UI component structure and navigation guide</li>
            <li>Asset references and migration instructions</li>
            <li>Database schema and relationships documentation</li>
          </ul>
        </div>

        <Button 
          onClick={handleExport} 
          disabled={isExporting}
          className="w-full"
          size="lg"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export to Unity"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          This will download two files: a JSON data export and a C# scripts file for Unity
        </p>
      </CardContent>
    </Card>
  );
}