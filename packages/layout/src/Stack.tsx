import { chakra, css, PropsOf, Prop, SystemProps } from "@chakra-ui/system"
import {
  Dict,
  getValidChildren,
  mapResponsive,
  __DEV__,
} from "@chakra-ui/utils"
import React, { cloneElement, forwardRef } from "react"
import { FlexOptions } from "./Flex"

export type StackDirection = Prop<"row" | "column">

type StackOptions = Pick<FlexOptions, "align" | "justify" | "wrap"> & {
  /**
   * The space between each stack item
   */
  spacing?: SystemProps["margin"]
  /**
   * The direction to stack the items.
   */
  direction?: StackDirection
  /**
   * If `true`, each stack item will show a divider
   */
  divider?: React.ReactElement
}

export type StackProps = PropsOf<typeof chakra.div> & StackOptions

export type StackDividerProps = PropsOf<typeof StackDivider>

export const StackDivider = chakra("hr", {
  baseStyle: { border: 0, alignSelf: "stretch" },
})

/**
 * Stacks help you easily create flexible and automatically distributed layouts
 *
 * You can stack elements in the horizontal or vertical direction,
 * and apply a space or/and divider between each element.
 *
 * It uses `display: flex` internally and renders a `div`.
 *
 * @see Docs https://chakra-ui.com/stack
 *
 */
export const Stack = forwardRef((props: StackProps, ref: React.Ref<any>) => {
  const {
    direction = "column",
    justify = "flex-start",
    align = "center",
    spacing = 2,
    wrap,
    children,
    divider,
    ...rest
  } = props

  const selector = "> * + *"

  const styles = {
    flexDirection: mapResponsive(direction, value =>
      value === "row" ? "row" : "column",
    ),
    [selector]: mapResponsive(direction, value => ({
      [value === "column" ? "marginTop" : "marginLeft"]: spacing,
      [value === "column" ? "marginLeft" : "marginTop"]: 0,
    })),
  }

  const validChildren = getValidChildren(children)

  const dividerStyles = mapResponsive(direction, value => {
    if (value === "row") {
      return {
        marginX: spacing,
        marginY: 0,
        borderLeft: "1px solid",
        borderBottom: 0,
        width: "auto",
      }
    }
    return {
      marginX: 0,
      marginY: spacing,
      borderLeft: 0,
      borderBottom: "1px solid",
      width: "100%",
    }
  })

  const hasDivider = !!divider

  const clones = validChildren.map((child, index) => {
    if (!hasDivider) return child

    const isLast = index + 1 === validChildren.length

    if (!isLast) {
      return (
        <React.Fragment key={index}>
          {child}
          {cloneElement(divider as React.ReactElement<any>, {
            css: css({ "&": dividerStyles }),
          })}
        </React.Fragment>
      )
    }

    return child
  })

  const sx = (theme: Dict) => {
    if (hasDivider) return undefined
    return css({ [selector]: styles[selector] })(theme)
  }

  return (
    <chakra.div
      ref={ref}
      display="flex"
      alignItems={align}
      justifyContent={justify}
      flexDirection={styles.flexDirection}
      flexWrap={wrap}
      sx={sx as any}
      {...rest}
    >
      {clones}
    </chakra.div>
  )
})

if (__DEV__) {
  Stack.displayName = "Stack"
}

export const HStack = (props: StackProps) => (
  <Stack align="center" {...props} direction="row" />
)

if (__DEV__) {
  HStack.displayName = "HStack"
}

export const VStack = (props: StackProps) => (
  <Stack align="center" {...props} direction="column" />
)

if (__DEV__) {
  VStack.displayName = "VStack"
}