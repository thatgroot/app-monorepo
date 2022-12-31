package so.arbitrum.app.wallet

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import so.arbitrum.app.wallet.reactModule.OKLiteManager
import so.arbitrum.app.wallet.reactModule.PermissionManager
import so.arbitrum.app.wallet.reactModule.MinimizerModule
import so.arbitrum.app.wallet.viewManager.homePage.HomePageManager


class MainReactNativePackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): MutableList<NativeModule> {
        val modules = mutableListOf<NativeModule>()

        modules.add(OKLiteManager(reactContext))
        modules.add(PermissionManager(reactContext))
        modules.add(MinimizerModule(reactContext))

        return modules
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): MutableList<ViewManager<*, *>> {
        val managers = mutableListOf<ViewManager<*, *>>()
        managers.add(HomePageManager())
        return managers
    }
}
