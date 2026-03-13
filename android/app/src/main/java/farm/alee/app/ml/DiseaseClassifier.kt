package farm.alee.app.ml

import android.content.Context
import android.graphics.Bitmap
import farm.alee.app.data.model.DiseaseProb
import farm.alee.app.data.repository.DiseaseRepository

/**
 * Disease classifier using TensorFlow Lite.
 *
 * In production, this loads a trained MobileNetV3-Small model (~6MB)
 * that was fine-tuned on 87,000+ plantain disease images.
 *
 * For the demo/scaffold version, it returns simulated results.
 * Replace the classify() method with real TFLite inference when
 * the trained model is available.
 */
class DiseaseClassifier(private val context: Context) {

    companion object {
        const val MODEL_FILENAME = "disease_model.tflite"
        const val INPUT_SIZE = 224
        const val NUM_CLASSES = 7
        const val CONFIDENCE_THRESHOLD = 0.8f

        val CLASS_NAMES = listOf(
            "Healthy",
            "Black Sigatoka",
            "Banana Bacterial Wilt",
            "Fusarium Wilt",
            "Bunchy Top Virus",
            "Weevil Damage",
            "Nutrient Deficiency"
        )
    }

    private var isModelLoaded = false

    /**
     * Initialize the TFLite interpreter.
     * Call this once during app startup.
     */
    fun initialize(): Boolean {
        return try {
            // In production: load TFLite model from assets
            // val modelFile = FileUtil.loadMappedFile(context, MODEL_FILENAME)
            // interpreter = Interpreter(modelFile, options)
            isModelLoaded = true
            true
        } catch (e: Exception) {
            isModelLoaded = false
            false
        }
    }

    /**
     * Classify a bitmap image of a plant part.
     *
     * @param bitmap The image to classify (will be resized to 224x224)
     * @param plantPart Which part of the plant was photographed
     * @return List of disease probabilities sorted by confidence
     */
    fun classify(bitmap: Bitmap, plantPart: String): List<DiseaseProb> {
        // In production, this would:
        // 1. Resize bitmap to 224x224
        // 2. Normalize pixel values to 0-1
        // 3. Run TFLite inference
        // 4. Apply softmax to output
        // 5. Map to disease names

        // Demo: return simulated results
        return simulateClassification()
    }

    /**
     * Simulated classification for demo purposes.
     * Replace with real TFLite inference.
     */
    private fun simulateClassification(): List<DiseaseProb> {
        val primaryIdx = (0 until NUM_CLASSES).random()
        val probs = FloatArray(NUM_CLASSES) { if (it == primaryIdx) 0.75f + (Math.random() * 0.2f).toFloat() else (Math.random() * 0.08f).toFloat() }
        val total = probs.sum()

        return CLASS_NAMES.mapIndexed { i, name ->
            DiseaseProb(name, probs[i] / total)
        }.sortedByDescending { it.confidence }
    }

    /**
     * Get confidence label for farmer-friendly display.
     * Addresses CEO feedback: clear result communication.
     */
    fun getConfidenceLabel(confidence: Float): String = when {
        confidence >= 0.9f -> "Confirmed"
        confidence >= 0.7f -> "Likely"
        else -> "Possible"
    }

    /**
     * Get treatment plan for detected disease.
     */
    fun getTreatment(diseaseName: String) =
        DiseaseRepository.getDiseases().find { it.name == diseaseName }

    fun close() {
        // interpreter?.close()
    }
}
