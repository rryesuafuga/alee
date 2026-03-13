package farm.alee.app.data.model

data class Disease(
    val id: Int,
    val name: String,
    val confidence: Float,
    val severity: String, // None, Low, Moderate, High, Critical
    val symptoms: List<String>,
    val treatments: TreatmentPlan
)

data class TreatmentPlan(
    val immediate: List<String>,
    val chemical: ChemicalTreatment?,
    val organic: List<String>,
    val environmental: List<String>,
    val prevention: List<String>,
    val costEstimate: String
)

data class ChemicalTreatment(
    val product: String,
    val dosage: String,
    val frequency: String
)

data class DiagnosisResult(
    val plantPart: String,
    val disease: Disease,
    val allProbabilities: List<DiseaseProb>,
    val timestamp: Long,
    val latitude: Double?,
    val longitude: Double?
)

data class DiseaseProb(
    val name: String,
    val confidence: Float
)

data class SensorReading(
    val deviceId: String,
    val timestamp: Long,
    val moisture: Float,
    val ph: Float,
    val nitrogen: Float,
    val phosphorus: Float,
    val potassium: Float,
    val temperature: Float,
    val humidity: Float,
    val batteryLevel: Int,
    val signalStrength: Int
)

data class Farm(
    val id: String,
    val name: String,
    val sizeAcres: Float,
    val latitude: Double,
    val longitude: Double,
    val district: String,
    val village: String,
    val plotCount: Int,
    val sensorCount: Int
)

data class Advisory(
    val id: String,
    val type: String, // irrigation, fertilizer, disease, harvest
    val priority: String, // high, medium, low
    val message: String,
    val plotId: String?,
    val sentAt: Long,
    val read: Boolean
)

enum class PlantPart(val label: String, val instruction: String) {
    LEAVES("Leaves", "Capture close-up of affected leaf surface"),
    STEM("Stem / Pseudostem", "Photograph discoloration or splitting"),
    BASE("Base / Corm Area", "Capture where plant emerges from soil"),
    FRUIT("Fruit / Bunch", "Photograph premature ripening or abnormalities")
}
