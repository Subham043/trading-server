import { prisma } from "../../db";
import { getConsolidatedHolding } from "../folio/folio.services";


export async function stats() {
 const totalProjects = await prisma.project.count();
 const totalRegistrarMasters = await prisma.registrarMaster.count();
 const totalCompanyMasters = await prisma.companyMaster.count();
 const shareCertificateMasterData = await prisma.shareCertificateMaster.findMany({
  include:{
   companyMaster: true
  }
 });
 const shareCertificateMaster = await Promise.all(
   shareCertificateMasterData.map(async (data) => {
     const shares = await prisma.folio.findMany({
       where: {
         shareCertificateID: data.id,
       },
     });
     const folio = await Promise.all(
       shares.map(async (share) => {
         const consolidatedHolding = await getConsolidatedHolding(share);
         const totalMarketValueNSE =
           Number(consolidatedHolding) *
           Number(data.companyMaster?.closingPriceNSE ?? 0);
         const totalMarketValueBSE =
           Number(consolidatedHolding) *
           Number(data.companyMaster?.closingPriceBSE ?? 0);
         return {
           consolidatedHolding,
           totalMarketValueNSE,
           totalMarketValueBSE,
         };
       })
     );
     const sum = folio.reduce(
       (acc, record) => acc + Number(record.consolidatedHolding ?? 0),
       0
     );
     const sumNSE = folio.reduce(
       (acc, record) => acc + Number(record.totalMarketValueNSE ?? 0),
       0
     );
     const sumBSE = folio.reduce(
       (acc, record) => acc + Number(record.totalMarketValueBSE ?? 0),
       0
     );
     return {
       totalShares: sum,
       totalValuationInNse: sumNSE,
       totalValuationInBse: sumBSE,
     };
   })
 );
 const sum = shareCertificateMaster.reduce(
   (acc, record) => acc + Number(record.totalShares ?? 0),
   0
 );
 const sumNSE = shareCertificateMaster.reduce(
   (acc, record) => acc + Number(record.totalValuationInNse ?? 0),
   0
 );
 const sumBSE = shareCertificateMaster.reduce(
   (acc, record) => acc + Number(record.totalValuationInBse ?? 0),
   0
 );
 const paymentTrackerData = await prisma.paymentTracker.findMany()
 const totalValuation = paymentTrackerData.reduce(
   (acc, record) => acc + (Number(record.valuation ?? 0) / (Number(record.percentageTotal ?? 0) / 100)),
   0
  );
  const paymentTrackerStagesData = await prisma.paymentTrackerStages.findMany({
    where:{
      status: "Paid"
    }
  })
  const totalPaid = paymentTrackerStagesData.reduce(
    (acc, record) => acc + Number(record.amount ?? 0),
    0
  );
 return {
   totalProjects: totalProjects ?? 0,
   totalRegistrarMasters: totalRegistrarMasters ?? 0,
   totalCompanyMasters: totalCompanyMasters ?? 0,
   totalShares: sum.toFixed(2) ?? 0,
   totalValuationInNse: sumNSE.toFixed(2) ?? 0,
   totalValuationInBse: sumBSE.toFixed(2) ?? 0,
   totalPaid: totalPaid.toFixed(2) ?? 0,
   totalValuation: totalValuation.toFixed(2) ?? 0,
 };
}