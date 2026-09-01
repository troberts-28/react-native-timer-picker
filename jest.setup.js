import { configure } from "@testing-library/react-native";

// Each picker column is a single adjustable element for screen readers, so its rows and label are
// hidden from the accessibility tree. Component tests still need to query them by text/testID.
configure({ defaultIncludeHiddenElements: true });
