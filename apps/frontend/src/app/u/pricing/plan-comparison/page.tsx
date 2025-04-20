// "use client"

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Check, X, ArrowRight } from "lucide-react";
// import { features, upcomingFeatures } from "@/constants/data";
// import { cn } from "@/lib/utils";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// interface Feature {
//   name: string;
//   starter: boolean | string;
//   professional: boolean | string;
//   enterprise: boolean | string;
// }

// const PricingHeader = () => (
//   <div className="text-center mb-12 md:mb-16">
//     <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
//       Simple, Transparent Pricing
//     </h1>
//     <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
//       Choose the plan that's right for you and start securing your credentials today.
//       All plans include a 14-day free trial.
//     </p>
//   </div>
// );

// const FeatureCheck = ({ value }: { value: boolean | string }) => {
//   if (typeof value === "boolean") {
//     return value ? (
//       <Check className="h-5 w-5 text-primary" />
//     ) : (
//       <X className="h-5 w-5 text-muted-foreground" />
//     );
//   }
//   return <span className="text-sm font-medium">{value}</span>;
// };

// const PricingTable = ({ features, title }: { features: Feature[], title: string }) => (
//   <div className="rounded-lg border bg-card">
//     <div className="p-6 border-b">
//       <h3 className="text-lg font-semibold">{title}</h3>
//     </div>
//     <Table>
//       <TableHeader className="bg-muted/50">
//         <TableRow>
//           <TableHead className="w-[300px]">Feature</TableHead>
//           <TableHead className="text-center">Free</TableHead>
//           <TableHead className="text-center">Starter ($9/mo)</TableHead>
//           <TableHead className="text-center">Professional ($29/mo)</TableHead>
//           <TableHead className="text-center">Enterprise</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {features.map((feature, i) => (
//           <TableRow key={feature.name} className={cn(i % 2 === 0 ? "bg-muted/50" : "bg-background")}>
//             <TableCell className="font-medium">{feature.name}</TableCell>
//             <TableCell className="text-center">
//               <div className="flex justify-center">
//                 <FeatureCheck value={feature.starter} />
//               </div>
//             </TableCell>
//             <TableCell className="text-center">
//               <div className="flex justify-center">
//                 <FeatureCheck value={feature.professional} />
//               </div>
//             </TableCell>
//             <TableCell className="text-center">
//               <div className="flex justify-center">
//                 <FeatureCheck value={feature.enterprise} />
//               </div>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </div>
// );

// const Pricing = () => {
//   return (
//     <div className="container mx-auto px-4 py-16 space-y-16">
//       <PricingHeader />
      
//       <Tabs defaultValue="current" className="w-full">
//         <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
//           <TabsTrigger value="current">Current Features</TabsTrigger>
//           <TabsTrigger value="upcoming">Upcoming Features</TabsTrigger>
//         </TabsList>
        
//         <TabsContent value="current" className="mt-4">
//           <PricingTable features={features} title="Current Features" />
//         </TabsContent>
        
//         <TabsContent value="upcoming" className="mt-4">
//           <PricingTable features={upcomingFeatures} title="Upcoming Features" />
//         </TabsContent>
//       </Tabs>

//       <div className="mt-16 text-center">
//         <h2 className="text-2xl font-bold mb-4">Need something different?</h2>
//         <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
//           Contact our sales team for custom pricing options tailored to your
//           specific requirements.
//         </p>
//         <Button variant="outline" size="lg">
//           Contact Sales <ArrowRight className="ml-2 h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Pricing;



export default function PlanComparison() {
  return (
    <div>Page Under Development</div>
  )
}