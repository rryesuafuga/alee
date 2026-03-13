package farm.alee.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import farm.alee.app.data.model.PlantPart
import farm.alee.app.data.repository.DiseaseRepository
import farm.alee.app.ui.theme.*

@Composable
fun ScanScreen() {
    var selectedPart by remember { mutableStateOf<PlantPart?>(null) }
    var isScanning by remember { mutableStateOf(false) }
    var showResults by remember { mutableStateOf(false) }
    var detectedDiseaseIdx by remember { mutableIntStateOf(0) }

    val diseases = remember { DiseaseRepository.getDiseases() }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            "Disease Scanner",
            fontSize = 24.sp,
            fontWeight = FontWeight.ExtraBold
        )
        Text(
            "Select the affected plant part, then take a photo",
            fontSize = 14.sp,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // Plant part selector — addresses Paul's feedback #1
        Text(
            "Which part is affected?",
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            PlantPart.entries.forEach { part ->
                val isSelected = selectedPart == part
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .border(
                            width = 2.dp,
                            color = if (isSelected) AleePrimary else Color.LightGray,
                            shape = RoundedCornerShape(12.dp)
                        )
                        .background(if (isSelected) AleePrimary.copy(alpha = 0.05f) else Color.Transparent)
                        .clickable { selectedPart = part; showResults = false }
                        .padding(12.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        when (part) {
                            PlantPart.LEAVES -> Icons.Default.Eco
                            PlantPart.STEM -> Icons.Default.Straighten
                            PlantPart.BASE -> Icons.Default.Foundation
                            PlantPart.FRUIT -> Icons.Default.Spa
                        },
                        contentDescription = part.label,
                        tint = if (isSelected) AleePrimary else Color.Gray,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        part.label.split(" ")[0],
                        fontSize = 11.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        color = if (isSelected) AleePrimary else Color.Gray
                    )
                }
            }
        }

        if (selectedPart != null) {
            Spacer(modifier = Modifier.height(8.dp))
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = AleePrimary.copy(alpha = 0.05f))
            ) {
                Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Info, "info", tint = AleePrimary, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(selectedPart!!.instruction, fontSize = 12.sp, color = AleePrimary)
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Camera placeholder
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(240.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(Color(0xFF1A202C)),
            contentAlignment = Alignment.Center
        ) {
            if (isScanning) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    CircularProgressIndicator(color = AleePrimary)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text("Analysing...", color = Color.White, fontSize = 14.sp)
                }
            } else {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Default.CameraAlt,
                        contentDescription = "Camera",
                        tint = Color.White.copy(alpha = 0.5f),
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        if (selectedPart != null) "Tap to capture ${selectedPart!!.label.lowercase()}"
                        else "Select a plant part first",
                        color = Color.White.copy(alpha = 0.6f),
                        fontSize = 13.sp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Scan button
        Button(
            onClick = {
                if (selectedPart != null && !isScanning) {
                    isScanning = true
                    detectedDiseaseIdx = (0 until diseases.size).random()
                    // Simulate processing delay
                    android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
                        isScanning = false
                        showResults = true
                    }, 2000)
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            enabled = selectedPart != null && !isScanning,
            shape = RoundedCornerShape(14.dp),
            colors = ButtonDefaults.buttonColors(containerColor = AleePrimary)
        ) {
            Icon(Icons.Default.Search, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                if (isScanning) "Analysing..." else "Scan ${selectedPart?.label ?: "Plant"}",
                fontWeight = FontWeight.Bold
            )
        }

        // Results — addresses Paul's feedback #3 and #4
        if (showResults) {
            val disease = diseases[detectedDiseaseIdx]
            val confidence = 0.75f + (Math.random() * 0.2f).toFloat()
            val confidenceLabel = when {
                confidence > 0.9f -> "Confirmed"
                confidence > 0.7f -> "Likely"
                else -> "Possible"
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Diagnosis card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (disease.name == "Healthy")
                        AleePrimary.copy(alpha = 0.08f)
                    else
                        AleeDanger.copy(alpha = 0.05f)
                )
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            disease.name,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Spacer(modifier = Modifier.weight(1f))
                        AssistChip(
                            onClick = {},
                            label = { Text(confidenceLabel, fontSize = 11.sp) },
                            colors = AssistChipDefaults.assistChipColors(
                                containerColor = if (disease.name == "Healthy") AleePrimary.copy(0.15f) else AleeAccent.copy(0.15f)
                            )
                        )
                    }
                    Text(
                        "${(confidence * 100).toInt()}% confidence — scanned from ${selectedPart?.label?.lowercase()}",
                        fontSize = 12.sp,
                        color = Color.Gray,
                        modifier = Modifier.padding(top = 4.dp)
                    )

                    if (disease.severity != "None") {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            "Severity: ${disease.severity}",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = when (disease.severity) {
                                "Critical" -> AleeDanger
                                "High" -> AleeAccent
                                "Moderate" -> AleeSecondary
                                else -> AleePrimary
                            }
                        )
                    }
                }
            }

            // Treatment plan — addresses Paul's feedback #4
            if (disease.name != "Healthy") {
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    "Treatment Plan",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(bottom = 8.dp)
                )

                TreatmentSection("Immediate Actions", disease.treatments.immediate, AleeDanger)

                if (disease.treatments.chemical != null) {
                    val chem = disease.treatments.chemical!!
                    TreatmentSection(
                        "Chemical Treatment",
                        listOf("Product: ${chem.product}", "Dosage: ${chem.dosage}", "Frequency: ${chem.frequency}"),
                        AleeAccent
                    )
                }

                TreatmentSection("Organic Alternatives", disease.treatments.organic, AleePrimary)
                TreatmentSection("Environmental Fixes", disease.treatments.environmental, AleeSecondary)
                TreatmentSection("Prevention", disease.treatments.prevention, AleePink)

                Card(
                    modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFF7FAFC))
                ) {
                    Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.AttachMoney, "cost", tint = AleeAccent, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Estimated cost: ${disease.treatments.costEstimate}", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                    }
                }
            } else {
                Spacer(modifier = Modifier.height(12.dp))
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = AleePrimary.copy(0.08f))
                ) {
                    Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Default.CheckCircle, "healthy", tint = AleePrimary, modifier = Modifier.size(40.dp))
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Plant is Healthy!", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text(
                            "Continue regular monitoring every 2 weeks.",
                            fontSize = 12.sp, color = Color.Gray,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(32.dp))
    }
}

@Composable
private fun TreatmentSection(title: String, items: List<String>, color: Color) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = color.copy(alpha = 0.05f))
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(title, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = color)
            Spacer(modifier = Modifier.height(4.dp))
            items.forEach { item ->
                Row(modifier = Modifier.padding(vertical = 2.dp)) {
                    Text("•", color = color, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(item, fontSize = 12.sp, color = Color.DarkGray)
                }
            }
        }
    }
}
