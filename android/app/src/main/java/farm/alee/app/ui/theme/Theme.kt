package farm.alee.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Wong (2011) color-blind safe palette
val AleePrimary = Color(0xFF009E73)
val AleeSecondary = Color(0xFF0072B2)
val AleeAccent = Color(0xFFE69F00)
val AleeDanger = Color(0xFFD55E00)
val AleePink = Color(0xFFCC79A7)
val AleeSky = Color(0xFF56B4E9)
val AleeYellow = Color(0xFFF0E442)
val AleeDark = Color(0xFF0D1B2A)

private val LightColorScheme = lightColorScheme(
    primary = AleePrimary,
    onPrimary = Color.White,
    secondary = AleeSecondary,
    onSecondary = Color.White,
    tertiary = AleeAccent,
    error = AleeDanger,
    background = Color(0xFFF8FAFC),
    surface = Color.White,
    onBackground = Color(0xFF1A202C),
    onSurface = Color(0xFF1A202C),
)

private val DarkColorScheme = darkColorScheme(
    primary = AleePrimary,
    onPrimary = Color.White,
    secondary = AleeSecondary,
    onSecondary = Color.White,
    tertiary = AleeAccent,
    error = AleeDanger,
    background = AleeDark,
    surface = Color(0xFF1B2D45),
    onBackground = Color.White,
    onSurface = Color.White,
)

@Composable
fun AleeTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography(),
        content = content
    )
}
