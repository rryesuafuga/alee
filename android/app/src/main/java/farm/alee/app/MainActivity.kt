package farm.alee.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import farm.alee.app.ui.AleeApp
import farm.alee.app.ui.theme.AleeTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            AleeTheme {
                AleeApp()
            }
        }
    }
}
