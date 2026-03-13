package farm.alee.app

import farm.alee.app.data.repository.DiseaseRepository
import farm.alee.app.ml.DiseaseClassifier
import org.junit.Assert.*
import org.junit.Test

class DiseaseClassifierTest {

    @Test
    fun `all 7 disease classes are defined`() {
        val diseases = DiseaseRepository.getDiseases()
        assertEquals(7, diseases.size)
        assertEquals("Healthy", diseases[0].name)
        assertEquals("Black Sigatoka", diseases[1].name)
        assertEquals("Banana Bacterial Wilt", diseases[2].name)
        assertEquals("Fusarium Wilt", diseases[3].name)
        assertEquals("Bunchy Top Virus", diseases[4].name)
        assertEquals("Weevil Damage", diseases[5].name)
        assertEquals("Nutrient Deficiency", diseases[6].name)
    }

    @Test
    fun `every disease has treatment plan`() {
        val diseases = DiseaseRepository.getDiseases()
        diseases.forEach { disease ->
            assertNotNull("${disease.name} should have treatments", disease.treatments)
            assertTrue("${disease.name} should have immediate actions", disease.treatments.immediate.isNotEmpty())
            assertTrue("${disease.name} should have prevention tips", disease.treatments.prevention.isNotEmpty())
            assertTrue("${disease.name} should have cost estimate", disease.treatments.costEstimate.isNotEmpty())
        }
    }

    @Test
    fun `critical diseases have no chemical treatment`() {
        val diseases = DiseaseRepository.getDiseases()
        val bxw = diseases.find { it.name == "Banana Bacterial Wilt" }
        val fusarium = diseases.find { it.name == "Fusarium Wilt" }

        assertNotNull(bxw)
        assertNotNull(fusarium)
        assertNull("BXW should have no chemical treatment", bxw!!.treatments.chemical)
        assertNull("Fusarium should have no chemical treatment", fusarium!!.treatments.chemical)
    }

    @Test
    fun `healthy plant has no severity`() {
        val healthy = DiseaseRepository.getDiseases().find { it.name == "Healthy" }
        assertNotNull(healthy)
        assertEquals("None", healthy!!.severity)
    }

    @Test
    fun `confidence labels are correct`() {
        assertEquals("Confirmed", getConfidenceLabel(0.95f))
        assertEquals("Confirmed", getConfidenceLabel(0.90f))
        assertEquals("Likely", getConfidenceLabel(0.85f))
        assertEquals("Likely", getConfidenceLabel(0.70f))
        assertEquals("Possible", getConfidenceLabel(0.60f))
        assertEquals("Possible", getConfidenceLabel(0.30f))
    }

    @Test
    fun `class names match architecture document`() {
        assertEquals(7, DiseaseClassifier.NUM_CLASSES)
        assertEquals(7, DiseaseClassifier.CLASS_NAMES.size)
        assertTrue(DiseaseClassifier.CLASS_NAMES.contains("Healthy"))
        assertTrue(DiseaseClassifier.CLASS_NAMES.contains("Black Sigatoka"))
        assertTrue(DiseaseClassifier.CLASS_NAMES.contains("Banana Bacterial Wilt"))
    }

    @Test
    fun `input size matches model requirements`() {
        assertEquals(224, DiseaseClassifier.INPUT_SIZE)
    }

    private fun getConfidenceLabel(confidence: Float): String = when {
        confidence >= 0.9f -> "Confirmed"
        confidence >= 0.7f -> "Likely"
        else -> "Possible"
    }
}
