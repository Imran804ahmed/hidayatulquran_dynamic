import PricingTable from "@/components/home/PricingTable";

export default function PricingSection() {
  return (
    <section id="MonthlyFee" className="pricing" aria-labelledby="pricing-heading">
      <div className="container" data-aos="fade-up">
        <header className="section-header">
          <h2 id="pricing-heading" style={{ color: "#E1B152" }}><strong>Online Quran Class Fees</strong></h2>
          <p>Affordable Monthly Plans for USA, UK, Canada, UAE and More</p>
        </header>
        <PricingTable />
      </div>
    </section>
  );
}
