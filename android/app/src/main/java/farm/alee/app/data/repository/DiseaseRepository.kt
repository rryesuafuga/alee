package farm.alee.app.data.repository

import farm.alee.app.data.model.*

/**
 * Repository for disease data including treatment plans.
 * Addresses CEO feedback: provides comprehensive treatment solutions
 * beyond just identifying the disease.
 */
object DiseaseRepository {

    fun getDiseases(): List<Disease> = listOf(
        Disease(
            id = 0, name = "Healthy", confidence = 0f,
            severity = "None",
            symptoms = listOf("Green leaves", "Normal growth", "No discoloration"),
            treatments = TreatmentPlan(
                immediate = listOf("No action required"),
                chemical = null,
                organic = listOf("Continue current practices"),
                environmental = listOf("Maintain 3m spacing", "Ensure good drainage"),
                prevention = listOf("Monitor every 2 weeks", "Maintain soil health"),
                costEstimate = "UGX 0"
            )
        ),
        Disease(
            id = 1, name = "Black Sigatoka", confidence = 0f,
            severity = "Moderate",
            symptoms = listOf("Yellow/brown leaf spots", "Dark streaks on leaves", "Premature leaf death"),
            treatments = TreatmentPlan(
                immediate = listOf("Remove severely affected leaves", "Improve air circulation"),
                chemical = ChemicalTreatment("Mancozeb 80% WP", "2.5g per litre", "Every 14 days"),
                organic = listOf("Neem oil solution (5ml/litre)", "Trichoderma bio-fungicide"),
                environmental = listOf("Avoid overhead irrigation", "Ensure adequate sunlight", "Space plants 3m apart"),
                prevention = listOf("Plant resistant varieties (FHIA-17)", "Regular de-leafing"),
                costEstimate = "UGX 15,000–30,000"
            )
        ),
        Disease(
            id = 2, name = "Banana Bacterial Wilt", confidence = 0f,
            severity = "Critical",
            symptoms = listOf("Yellowing leaves", "Premature ripening", "Bacterial ooze from cut stem"),
            treatments = TreatmentPlan(
                immediate = listOf("Remove entire infected plant", "Sterilize all tools with bleach", "Do NOT cut male bud"),
                chemical = null,
                organic = listOf("No chemical treatment exists", "Complete removal and sanitation only"),
                environmental = listOf("Remove plant including corm", "No replanting for 6 months", "Control insect vectors"),
                prevention = listOf("Remove male buds with forked stick", "Quarantine new materials", "Report to extension officer"),
                costEstimate = "UGX 5,000"
            )
        ),
        Disease(
            id = 3, name = "Fusarium Wilt", confidence = 0f,
            severity = "Critical",
            symptoms = listOf("Yellowing from older leaves", "Pseudostem splitting", "Brown vascular tissue"),
            treatments = TreatmentPlan(
                immediate = listOf("Remove and burn infected plant", "Do not move soil", "Quarantine plot"),
                chemical = null,
                organic = listOf("Apply Trichoderma harzianum", "Add organic matter to soil"),
                environmental = listOf("Improve drainage", "Raise pH to 6.5–7.0 with lime", "Use certified clean material"),
                prevention = listOf("Plant resistant varieties", "Crop rotation 3+ years", "Never share tools"),
                costEstimate = "UGX 50,000+"
            )
        ),
        Disease(
            id = 4, name = "Bunchy Top Virus", confidence = 0f,
            severity = "High",
            symptoms = listOf("Stunted growth", "Narrow upright leaves", "Dark green streaks on petioles"),
            treatments = TreatmentPlan(
                immediate = listOf("Uproot and destroy plant", "Check 20m radius"),
                chemical = ChemicalTreatment("Imidacloprid 200 SL", "0.5ml per litre", "Single application to nearby plants"),
                organic = listOf("Neem insecticide for aphids", "Introduce ladybird beetles"),
                environmental = listOf("Ensure adequate sunlight", "Remove weeds that harbour aphids"),
                prevention = listOf("Use virus-free planting material", "Control banana aphids", "Inspect every 1–2 weeks"),
                costEstimate = "UGX 20,000–40,000"
            )
        ),
        Disease(
            id = 5, name = "Weevil Damage", confidence = 0f,
            severity = "Moderate",
            symptoms = listOf("Tunnels in pseudostem base", "Wilting despite adequate water", "Jelly-like frass"),
            treatments = TreatmentPlan(
                immediate = listOf("Set pheromone traps", "Use pseudostem traps"),
                chemical = ChemicalTreatment("Fipronil 5% GR", "20g per mat", "Every 6 months"),
                organic = listOf("Split pseudostem traps weekly", "Beauveria bassiana fungi"),
                environmental = listOf("Remove old pseudostems after harvest", "Field sanitation"),
                prevention = listOf("Clean planting material", "Hot water treatment 52°C/20min", "Inspect corms regularly"),
                costEstimate = "UGX 10,000–25,000"
            )
        ),
        Disease(
            id = 6, name = "Nutrient Deficiency", confidence = 0f,
            severity = "Low",
            symptoms = listOf("Leaf discoloration", "Slow growth", "Small fruit bunches"),
            treatments = TreatmentPlan(
                immediate = listOf("Identify specific nutrient from symptoms", "Apply fertiliser within 1 week"),
                chemical = ChemicalTreatment("NPK 17-17-17", "200g per plant", "Every 3 months"),
                organic = listOf("Farmyard manure 15kg per mat", "Banana peelings as mulch"),
                environmental = listOf("Maintain pH 5.5–7.0", "6+ hours direct sun", "25mm water per week"),
                prevention = listOf("Soil test every season", "Heavy organic mulching", "Intercrop with legumes"),
                costEstimate = "UGX 8,000–15,000"
            )
        )
    )
}
